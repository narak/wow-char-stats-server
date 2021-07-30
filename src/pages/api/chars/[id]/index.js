import { getCharsById, updateCharsById } from '../../../../api/firebase';

async function getCharById(req, res) {
  const { id } = req.query;
  const statsPage = await getCharsById(id);
  res.status(200).json({ characters: statsPage.get('characters') });
}

async function updateCharById(req, res) {
  const { id } = req.query;
  console.log(req.body);
  if (req.body.characters) {
    const statsPage = await updateCharsById(id, req.body.characters);
    res.status(200).json({ characters: req.body.characters });
  } else {
    res.status(400).json({ message: 'Missing characters to be updated' });
  }
}

export default async function CharById(req, res) {
  if (req.method === 'GET') {
    return getCharById(req, res);
  } else if (req.method === 'PUT') {
    return updateCharById(req, res);
  }
}
