"use client";

import { createContext, useContext } from "react";

export const HiringAnnouncementContext = createContext(() => {});

export const useHiringAnnouncement = () =>
  useContext(HiringAnnouncementContext);
