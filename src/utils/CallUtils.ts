import JitsiMeet, { JitsiMeetEvents } from 'react-native-jitsi-meet';

/**
 * Starts a video call using Jitsi Meet.
 * @param roomName - The room name for the Jitsi video call.
 * @param user - The current user object containing name, email, and avatar.
 */
export const startCall = (roomName: string, user: { displayName: string; email?: string; avatar?: string }) => {
  try {
    const url = `https://meet.dint.com/${roomName}`;
    
    // Pass user information dynamically
    const userInfo = {
      displayName: user.displayName,
      email: user.email || '', // Optional: pass email if available
      avatar: user.avatar || '', // Optional: pass avatar URL if available
    };

    const options = {
      audioMuted: false,
      videoMuted: false,
    };

    const meetFeatureFlags = {
      addPeopleEnabled: false,
      chatEnabled: true,
    };

    // Start Jitsi Meet call
    JitsiMeet.call(url, userInfo, options, meetFeatureFlags);

    // Event listener for when the call ends
    JitsiMeetEvents.addListener('CONFERENCE_TERMINATED', (data: any) => {
      console.log('Call ended:', data);
      JitsiMeet.endCall();
    });
  } catch (error) {
    console.error('Failed to start call:', error);
  }
};

/**
 * Ends the video call using Jitsi Meet.
 */
export const endCall = () => {
  JitsiMeet.endCall();
};
