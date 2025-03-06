interface User {
    created_at: number;
    has_accepted_terms: boolean;
    id: string;
    is_guest: boolean;
    linked_accounts: Record<string, any>[];  // Array of flexible hashmaps/dictionaries
  }

  export default User;