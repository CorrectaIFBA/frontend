/*
  Splits a file the way the service reads it (Java's readLines): any line
  break ends a line and a final break adds no empty line. Read here so the
  preview shows exactly the test cases the import creates.
*/
export async function readLines(file: File) {
  const text = await file.text()
  if (!text) return []
  return text.replace(/(\r\n|\r|\n)$/, '').split(/\r\n|\r|\n/)
}
