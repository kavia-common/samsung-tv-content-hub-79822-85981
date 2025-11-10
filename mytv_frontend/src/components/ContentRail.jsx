/**
 * PUBLIC_INTERFACE
 * ContentRail
 * A small adapter over Rail to match requested name. Accepts:
 * - title: string
 * - items: array of { id, title, image }
 * - railIndex/currentRail/setCurrentRail: for focus management (optional)
 * - onOpenDetails: callback on enter
 */
import Rail from "./../components/Rail.jsx";

export default function ContentRail(props) {
  return <Rail {...props} />;
}
