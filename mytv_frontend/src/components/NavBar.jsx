/**
 * PUBLIC_INTERFACE
 * NavBar
 * Thin wrapper that reuses TopMenu to satisfy requested component naming.
 * Props:
 * - items: array of { label, path }
 */
import TopMenu from "./TopMenu.jsx";

export default function NavBar({ items = [] }) {
  return <TopMenu items={items} />;
}
