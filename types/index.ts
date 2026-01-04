export interface User {
  id: number;
  nama: string;
  email: string;
  nim_nip: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

import React from "react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}
