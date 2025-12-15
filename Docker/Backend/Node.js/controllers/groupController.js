import * as model from "../models/groupModel.js";
import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function listGroups(req, res, next) {
  try {
    const my = req.query.my === "true";
    const rows = await model.findGroupsForUser(req.user.user_id, my);
    return res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function getGroupByName(req, res, next) {
  try {
    const group = await model.findGroupByName(req.params.name);
    if (!group) return res.status(404).json({ message: "Group not found." });

    return res.json(group);
  } catch (e) {
    next(e);
  }
}

export async function getMembers(req, res, next) {
  try {
    const rows = await model.findMembersByGroupName(req.params.name);

    return res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function createGroup(req, res, next) {
  try {
    const created = await model.createNewGroup(
      req.body.name,
      req.body.description,
      req.user.user_id
    );

    return res.status(201).json(created);
  } catch (e) {
    if (e.code === "23505")
      return res.status(409).json({ message: "Group name already exists." });
    next(e);
  }
}

export async function addItem(req, res, next) {
  try {
    const added = await model.insertGroupItem(
      req.params.name,
      req.body.type,
      req.body.tmdbId,
      req.body.title,
      req.body.posterPath,
      req.body.releaseYear
    );
    if (!added)
      return res.status(409).json({ message: "Item exists or group missing." });

    return res.status(201).json(added);
  } catch (e) {
    next(e);
  }
}

export async function removeItem(req, res, next) {
  try {
    const deleted = await model.deleteGroupItem(
      req.params.name,
      req.user.user_id,
      req.body.type,
      req.body.title
    );
    if (!deleted)
      return res.status(403).json({ message: "Not allowed or not found." });

    return res.json({ message: "Item removed.", item: deleted });
  } catch (e) {
    next(e);
  }
}

export async function uploadIcon(req, res, next) {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });
    const meta = await fileTypeFromFile(req.file.path);
    if (!whitelist.includes(meta.mime)) {
      await fs.unlink(req.file.path);

      return res.status(400).json({ message: "Invalid file." });
    }

    const updated = await model.updateGroupIcon(
      req.params.name,
      req.file.filename,
      req.user.user_id
    );
    if (!updated) return res.status(403).json({ message: "Not allowed." });

    return res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteGroup(req, res, next) {
  try {
    const removed = await model.removeGroup(req.params.name, req.user.user_id);
    if (!removed)
      return res.status(403).json({ message: "Not allowed or not found." });

    return res.json({ message: "Group deleted." });
  } catch (e) {
    next(e);
  }
}

export async function joinGroup(req, res, next) {
  try {
    const groupId = parseInt(req.params.groupId);
    const check = await model.checkJoinState(groupId, req.user.user_id);
    if (!check) return res.status(404).json({ message: "Group not found." });
    if (check.is_member > 0)
      return res.status(409).json({ message: "Already a member." });
    if (check.has_request > 0)
      return res.status(409).json({ message: "Request already sent." });
    const inserted = await model.insertJoinRequest(req.user.user_id, groupId);

    return res
      .status(201)
      .json({ message: "Join request sent.", request: inserted });
  } catch (e) {
    next(e);
  }
}

export async function getRequests(req, res, next) {
  try {
    const rows = await model.findRequestsForGroup(
      parseInt(req.params.groupId),
      req.user.user_id
    );

    return res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function acceptRequest(req, res, next) {
  try {
    const rows = await model.acceptJoinRequest(parseInt(req.params.requestId));
    if (rows.length === 0)
      return res
        .status(403)
        .json({ message: "Not allowed or request processed." });

    return res.json({ message: "Request accepted.", added: rows });
  } catch (e) {
    next(e);
  }
}

export async function rejectRequest(req, res, next) {
  try {
    const result = await model.rejectJoinRequest(
      parseInt(req.params.requestId)
    );
    if (!result)
      return res
        .status(403)
        .json({ message: "Not allowed or request processed." });

    return res.json({ message: "Request rejected.", request: result });
  } catch (e) {
    next(e);
  }
}

export async function myRequests(req, res, next) {
  try {
    const rows = await model.findMyRequests(req.user.user_id);

    return res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function leaveGroup(req, res, next) {
  try {
    const result = await model.leaveGroupByName(
      req.params.name,
      req.user.user_id
    );
    if (!result)
      return res
        .status(403)
        .json({ message: "Cannot leave group or not a member." });

    return res.json({ message: "Left group successfully." });
  } catch (e) {
    next(e);
  }
}
