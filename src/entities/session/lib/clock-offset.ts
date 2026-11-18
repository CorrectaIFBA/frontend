/* ---------------------------------------------------------------------------
   Time. The service decides when a session ends; the page only counts down
   from the server's clock, corrected by how far the viewer's clock is off.
--------------------------------------------------------------------------- */

/** Milliseconds to add to `Date.now()` to read the server's clock. */
export function clockOffset(serverNow: string) {
  return new Date(serverNow).getTime() - Date.now()
}
