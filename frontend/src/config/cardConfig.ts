import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { NoteIcon } from "../icons/NoteIcon";
import { MusicIcon } from "../icons/MusicIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { CardType } from "../types/cardTypes";

export interface CardTypeConfig {
  icon: React.ComponentType;
  color: string;
  label: string;
}

export const CARD_TYPE_CONFIG: Record<CardType, CardTypeConfig> = {
  youtube: {
    icon: YoutubeIcon,
    color: "text-red-500",
    label: "YouTube Video"
  },
  twitter: {
    icon: TwitterIcon,
    color: "text-blue-400",
    label: "Twitter Post"
  },
  instagram: {
    icon: InstagramIcon,
    color: "text-pink-500",
    label: "Instagram Post"
  },
  note: {
    icon: NoteIcon,
    color: "text-yellow-500",
    label: "Note"
  },
  music: {
    icon: MusicIcon,
    color: "text-purple-500",
    label: "Music Link"
  },
  link: {
    icon: LinkIcon,
    color: "text-blue-600",
    label: "External Link"
  }
};

export const getCardTypeConfig = (type: CardType): CardTypeConfig => {
  return CARD_TYPE_CONFIG[type] || {
    icon: DocumentIcon,
    color: "text-gray-500",
    label: "Document"
  };
};