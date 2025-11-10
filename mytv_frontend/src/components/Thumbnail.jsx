/**
 * PUBLIC_INTERFACE
 * Thumbnail
 * Wrapper over ThumbnailCard to provide requested naming.
 * Props:
 * - src: string
 * - title: string
 * - onEnter: function
 */
import ThumbnailCard from "./ThumbnailCard.jsx";

export default function Thumbnail({ src, title, onEnter }) {
  return <ThumbnailCard src={src} title={title} onEnter={onEnter} />;
}
