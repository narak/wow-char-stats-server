import { getStatsPage } from '../../../api/firebase';

export default async function (req, res) {
  res.status(200).json({ message: 'Please specify a page ID to get its characters' });
}
