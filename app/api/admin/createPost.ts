// pages/api/admin/createPost.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

interface ResponseData {
  success: boolean;
  message?: string;
  error?: any;
}

const initializeFirebaseAdmin = (): void => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
      }),
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  initializeFirebaseAdmin();
  
  // Get the auth token from the request
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  try {
    // Verify the token
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Check if user has superUser claim
    if (!decodedToken.superUser) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    // Process the admin request
    // Your admin functionality here
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
}