import 'dotenv/config';
import { app } from './app';
const port=Number(process.env.PORT)||4547;
app.listen(port,()=>console.log(`เซิร์ฟเวอร์ PDA BLISS ทำงานที่ http://localhost:${port}`));
