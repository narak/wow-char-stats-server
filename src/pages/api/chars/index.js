export default async function Char(req, res) {
  res.status(200).json({ message: 'Please specify a page ID to get its characters' });
}
