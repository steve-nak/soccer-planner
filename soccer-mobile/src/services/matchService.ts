import { Match, MatchDetail, MatchesResponse } from '../types/match';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export class MatchService {
  /**
   * Fetch active matches with pagination
   */
  static async getMatches(
    page: number = 1,
    pageSize: number = 10,
    token?: string
  ): Promise<MatchesResponse> {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured');
    }

    const url = `${API_BASE_URL}/matches?page=${page}&pageSize=${pageSize}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch matches: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Could not parse error response
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Matches API response:', data);
      return data as MatchesResponse;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  /**
   * Fetch a single match with full details
   */
  static async getMatchDetail(id: number, token?: string): Promise<MatchDetail> {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured');
    }

    const url = `${API_BASE_URL}/matches/${id}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch match: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Could not parse error response
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data as MatchDetail;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  /**
   * Join a match
   */
  static async joinMatch(id: number, token: string): Promise<void> {
    console.log('MatchService.joinMatch called', { id, token: !!token });
    if (!API_BASE_URL) {
      console.error('API_BASE_URL not configured');
      throw new Error('API URL not configured');
    }

    const url = `${API_BASE_URL}/matches/${id}/join`;
    console.log('Sending join request to:', url);

    try {
      console.log('Making fetch request');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch response received:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        console.error('Response not ok:', response.status);
        let errorMessage = `Failed to join match: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          // Could not parse error response
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      console.log('Join match successful');
    } catch (error) {
      console.error('Error joining match:', error);
      throw error;
    }
  }

  /**
   * Leave a match
   */
  static async leaveMatch(id: number, token: string): Promise<void> {
    console.log('MatchService.leaveMatch called', { id, token: !!token });
    if (!API_BASE_URL) {
      console.error('API_BASE_URL not configured');
      throw new Error('API URL not configured');
    }

    const url = `${API_BASE_URL}/matches/${id}/leave`;
    console.log('Sending leave request to:', url);

    try {
      console.log('Making fetch request');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch response received:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        console.error('Response not ok:', response.status);
        let errorMessage = `Failed to leave match: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          // Could not parse error response
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      console.log('Leave match successful');
    } catch (error) {
      console.error('Error leaving match:', error);
      throw error;
    }
  }

  /**
   * Update extra slots for a joined player
   */
  static async updateSlots(id: number, extraSlots: number, token: string): Promise<void> {
    if (!API_BASE_URL) {
      throw new Error('API URL not configured');
    }

    const url = `${API_BASE_URL}/matches/${id}/slots`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ extraSlots }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to update slots: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // Could not parse error response
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating slots:', error);
      throw error;
    }
  }
}

export default MatchService;
