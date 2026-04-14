import Ticket from "../models/Ticket.js";

// @GET /api/tickets — admin: get all tickets, user: get their tickets
export const getTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    let query = {};

    // If not admin, only show user's own tickets
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      query.user = req.user._id;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { ticketId: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate("user", "name email");

    const total = await Ticket.countDocuments(query);

    // Calculate stats for admin
    let stats = null;
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      const openCount = await Ticket.countDocuments({ status: "Open" });
      const inProgressCount = await Ticket.countDocuments({
        status: "In Progress",
      });
      const resolvedCount = await Ticket.countDocuments({ status: "Resolved" });
      const closedCount = await Ticket.countDocuments({ status: "Closed" });

      stats = {
        total,
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        closed: closedCount,
      };
    }

    res.json({
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/tickets/:id
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Check permission: admin can view any, user only their own
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      if (ticket.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

// @POST /api/tickets — user creates new ticket
export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, message } = req.body;

    if (!subject || !category || !message) {
      return res
        .status(400)
        .json({ message: "Please provide subject, category, and message." });
    }

    const ticket = await Ticket.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      subject,
      category,
      priority: priority || "Medium",
      message,
      status: "Open",
      replies: [],
    });

    res.status(201).json({
      message: "Ticket created successfully.",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/tickets/:id/reply — admin or user reply
export const addReply = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required." });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Check permission
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    const isOwner = ticket.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Determine who is replying
    const from = isAdmin ? "Trendova Support" : "You";

    const reply = {
      from,
      text: text.trim(),
      time: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    ticket.replies.push(reply);

    // Auto-update status if ticket was Open and admin replies
    if (isAdmin && ticket.status === "Open") {
      ticket.status = "In Progress";
    }

    await ticket.save();
    await ticket.populate("user", "name email");

    res.json({
      message: "Reply added successfully.",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/tickets/:id/status — admin only
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (
      !status ||
      !["Open", "In Progress", "Resolved", "Closed"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    ticket.status = status;
    await ticket.save();
    await ticket.populate("user", "name email");

    res.json({
      message: `Ticket status updated to ${status}.`,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/tickets/:id — user can delete their own, admin can delete any
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Check permission
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    const isOwner = ticket.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied." });
    }

    const ticketId = ticket.ticketId;
    await ticket.deleteOne();

    res.json({
      message: `Ticket ${ticketId} has been deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/tickets/admin/stats — admin only
export const getTicketStats = async (req, res, next) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: "Open" });
    const inProgress = await Ticket.countDocuments({ status: "In Progress" });
    const resolved = await Ticket.countDocuments({ status: "Resolved" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    const byPriority = {
      Low: await Ticket.countDocuments({ priority: "Low" }),
      Medium: await Ticket.countDocuments({ priority: "Medium" }),
      High: await Ticket.countDocuments({ priority: "High" }),
    };

    const byCategory = {
      "Order Issue": await Ticket.countDocuments({ category: "Order Issue" }),
      "Return & Refund": await Ticket.countDocuments({
        category: "Return & Refund",
      }),
      "Product Inquiry": await Ticket.countDocuments({
        category: "Product Inquiry",
      }),
      "Payment Issue": await Ticket.countDocuments({
        category: "Payment Issue",
      }),
      "Shipping Query": await Ticket.countDocuments({
        category: "Shipping Query",
      }),
      Other: await Ticket.countDocuments({ category: "Other" }),
    };

    res.json({
      total,
      open,
      inProgress,
      resolved,
      closed,
      byPriority,
      byCategory,
    });
  } catch (error) {
    next(error);
  }
};