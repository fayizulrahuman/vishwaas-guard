# **App Name**: Vishwaas Guard

## Core Features:

- User Authentication: Secure user login and management using Firebase Authentication.
- Real-time Camera Overlay (Privacy-Focused): Display a real-time camera feed with an overlay for visual analysis and user interaction, activated only with explicit user consent and clear visual indicators when active to address privacy concerns. This supports the 'Shield' interface.
- Real-time Audio Analysis: Capture and buffer 2-second audio segments from system calls for immediate analysis.
- On-device Face Liveness Detection: Utilize Firebase ML and a local YOLOv8 TFLite model to perform real-time face-liveness detection on the device, checking for deepfakes.
- Deepfake Probability Tool: Employ a Firebase Genkit backend flow using Gemini 1.5 Flash to take audio/video metadata and calculate a deepfake probability.
- Scam Signature and User Report Storage: Store scam signatures and user-submitted reports in the Firebase Data Connect (PostgreSQL) database.
- In-App Deepfake Alerts: Trigger immediate Firebase In-App Messages to alert users when a deepfake is detected during a call.

## Style Guidelines:

- The primary color, 'Guardian Blue' (#1C54C2), a strong, trustworthy blue, evokes security and confidence, forming the foundation of a light color scheme. This hue aligns with the app's mission of protection and vigilance.
- The background color, 'Shield Ivory' (#F0F4FA), is a very light, almost white tone with a subtle blue tint, providing a clean and approachable canvas that enhances readability and offers a reassuring, calm feel.
- The accent color, 'Vigilance Aqua' (#4FD8F2), a vibrant and bright sky-blue/cyan, is used for calls to action and critical highlights, providing a noticeable contrast while remaining within the analogous color family, signaling alertness and clarity.
- For both headlines and body text, the 'Inter' sans-serif font is recommended. Its modern, objective, and neutral aesthetic provides excellent readability and a contemporary feel, suitable for a tech-driven safety application.
- Utilize modern, clean, and distinct vector icons. Emphasize symbols related to safety, protection (e.g., shields, locks), alerts (e.g., alarms, warnings), and technology, maintaining a consistent, reassuring visual language throughout the interface.
- Implement a clean, structured, and intuitive layout that embodies a 'Shield' interface concept. Information should be presented clearly and hierarchically, prioritizing real-time alerts and user controls for immediate accessibility. Utilize card-based elements for scam signatures and user reports.
- Incorporate subtle, non-intrusive animations, particularly for alerts and state changes, to gently draw user attention without causing distraction. Transitions should be smooth and deliberate, enhancing the user experience rather than detracting from it.