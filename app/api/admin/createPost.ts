import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

interface ResponseData {
  success: boolean;
  message?: string;
  error?: string;
}

interface CustomTokenClaims extends DecodedIdToken {
  superUser?: boolean;
}

const initializeFirebaseAdmin = (): void => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
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
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: No token provided' 
    });
  }
  
  try {
    // Verify the token with explicit typing
    const decodedToken = await getAuth().verifyIdToken(token) as CustomTokenClaims;
    
    // Strict check for superUser claim
    if (!decodedToken.superUser) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Insufficient permissions' 
      });
    }
    
    // Additional type-safe checks can be added here
    return res.status(200).json({ success: true });
  } catch (error) {
    // Comprehensive error handling with type guards
    if (error instanceof Error) {
      return res.status(401).json({ 
        success: false, 
        error: `Authentication failed: ${error.message}` 
      });
    }
    
    // Fallback for unexpected error types
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error: Unknown authentication failure'
    });
  }
}