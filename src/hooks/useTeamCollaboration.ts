import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  status: 'online' | 'focus' | 'break' | 'offline';
  currentTask?: string;
  productivity: number;
  sessionsToday: number;
  lastSeen: string;
}

export interface TeamSession {
  id: string;
  name: string;
  description: string;
  start_time: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_by: string;
  participants: string[];
  team_id?: string;
}

export const useTeamCollaboration = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [teamSessions, setTeamSessions] = useState<TeamSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch friends and their stats
  const fetchFriends = async () => {
    if (!user) return;

    try {
      // Get accepted friendships - simplified query
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        return;
      }

      // Get friend profiles separately
      const friendIds = friendships?.map(friendship => 
        friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id
      ) || [];

      if (friendIds.length === 0) {
        setFriends([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', friendIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      const friendProfiles = profiles?.map(profile => ({
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        status: 'online' as const,
        productivity: Math.floor(Math.random() * 40) + 60,
        sessionsToday: Math.floor(Math.random() * 5) + 1,
        lastSeen: new Date().toISOString(),
      })) || [];

      setFriends(friendProfiles);
    } catch (error) {
      console.error('Error in fetchFriends:', error);
    }
  };

  // Fetch team sessions
  const fetchTeamSessions = async () => {
    if (!user) return;

    try {
      const { data: sessions, error } = await supabase
        .from('shared_focus_sessions')
        .select(`
          *,
          session_participants(user_id, status)
        `)
        .or(`created_by.eq.${user.id},session_participants.user_id.eq.${user.id}`)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching team sessions:', error);
        return;
      }

      const processedSessions = sessions?.map(session => ({
        id: session.id,
        name: session.name,
        description: session.description || '',
        start_time: session.start_time,
        duration: session.duration,
        status: session.status as 'scheduled' | 'active' | 'completed' | 'cancelled',
        created_by: session.created_by,
        participants: session.session_participants?.map((p: any) => p.user_id) || [],
        team_id: session.team_id,
      })) || [];

      setTeamSessions(processedSessions);
    } catch (error) {
      console.error('Error in fetchTeamSessions:', error);
    }
  };

  // Add friend by email
  const addFriend = async (email: string) => {
    if (!user) return false;

    try {
      // First, find the user by email
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (userError) {
        toast.error('Fout bij het zoeken naar gebruiker');
        return false;
      }
      if (!targetUser) {
        toast.error('Gebruiker niet gevonden. Controleer het e-mailadres.');
        return false;
      }

      if (targetUser.id === user.id) {
        toast.error('Je kunt jezelf niet toevoegen als vriend');
        return false;
      }

      // Check if friendship already exists
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        toast.error('Vriendschapsverzoek bestaat al');
        return false;
      }

      // Create friendship request
      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          addressee_id: targetUser.id,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error creating friendship:', insertError);
        toast.error('Fout bij het versturen van vriendschapsverzoek');
        return false;
      }

      toast.success(`Vriendschapsverzoek verstuurd naar ${targetUser.full_name}!`);
      return true;
    } catch (error) {
      console.error('Error in addFriend:', error);
      toast.error('Er ging iets mis');
      return false;
    }
  };

  // Create team session
  const createTeamSession = async (sessionData: {
    name: string;
    description: string;
    start_time: string;
    duration: number;
    participantIds: string[];
  }) => {
    if (!user) return false;

    try {
      const { data: session, error: sessionError } = await supabase
        .from('shared_focus_sessions')
        .insert({
          name: sessionData.name,
          description: sessionData.description,
          start_time: sessionData.start_time,
          duration: sessionData.duration,
          created_by: user.id,
          status: 'scheduled'
        })
        .select()
        .single();

      if (sessionError || !session) {
        console.error('Error creating session:', sessionError);
        toast.error('Fout bij het maken van sessie');
        return false;
      }

      // Add participants
      const participantInserts = sessionData.participantIds.map(userId => ({
        session_id: session.id,
        user_id: userId,
        status: 'invited'
      }));

      if (participantInserts.length > 0) {
        const { error: participantError } = await supabase
          .from('session_participants')
          .insert(participantInserts);

        if (participantError) {
          console.error('Error adding participants:', participantError);
        }
      }

      toast.success('Team sessie succesvol aangemaakt!');
      await fetchTeamSessions();
      return true;
    } catch (error) {
      console.error('Error in createTeamSession:', error);
      toast.error('Er ging iets mis');
      return false;
    }
  };

  // Join team session
  const joinTeamSession = async (sessionId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('session_participants')
        .upsert({
          session_id: sessionId,
          user_id: user.id,
          status: 'joined'
        });

      if (error) {
        console.error('Error joining session:', error);
        toast.error('Fout bij het deelnemen aan sessie');
        return false;
      }

      toast.success('Je neemt nu deel aan de sessie!');
      await fetchTeamSessions();
      return true;
    } catch (error) {
      console.error('Error in joinTeamSession:', error);
      return false;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const sessionsChannel = supabase
      .channel('team-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_focus_sessions'
        },
        () => {
          fetchTeamSessions();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants'
        },
        () => {
          fetchTeamSessions();
        }
      )
      .subscribe();

    const friendsChannel = supabase
      .channel('friendships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships'
        },
        () => {
          fetchFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(friendsChannel);
    };
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      Promise.all([fetchFriends(), fetchTeamSessions()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    friends,
    teamSessions,
    loading,
    addFriend,
    createTeamSession,
    joinTeamSession,
    refreshData: () => Promise.all([fetchFriends(), fetchTeamSessions()])
  };
};
