import { getStatsPage } from '../../../api/firebase';

export default async function (req, res) {
  const { id } = req.query;
  const statsPage = await getStatsPage(id);
  res.status(200).json({ characters: statsPage.get('characters') });
}
