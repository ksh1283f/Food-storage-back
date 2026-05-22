import { Request, Response } from 'express';
import * as userService from '../services/userService';
import admin from '../config/firebase';

export async function syncProfile(req: Request, res: Response): Promise<void> {
  const { uid, email, name, picture, firebase } = req.user!;
  const provider = firebase?.sign_in_provider ?? 'unknown';

  const user = await userService.upsertUser(
    uid,
    email ?? null,
    name ?? null,
    picture ?? null,
    provider
  );

  res.json(user);
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  const uid = req.user!.uid;
  const user = await userService.getUserByUid(uid);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  const uid = req.user!.uid;

  await userService.deleteUser(uid);
  await admin.auth().deleteUser(uid);

  res.status(204).send();
}
