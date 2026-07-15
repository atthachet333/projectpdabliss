import { Router, type Request, type Response } from 'express';
import type { ApiResponse, ContactRequestBody } from '../types/contact';
const router=Router();
router.post('/',(req:Request<Record<string,never>,ApiResponse<ContactRequestBody>,ContactRequestBody>,res:Response<ApiResponse<ContactRequestBody>>):void=>{const {name,phone,email,service,message}=req.body;const errors:string[]=[];if(!name?.trim())errors.push('กรุณาระบุชื่อ');if(!phone?.trim())errors.push('กรุณาระบุเบอร์โทรศัพท์');if(!service?.trim())errors.push('กรุณาระบุบริการที่สนใจ');if(errors.length){res.status(400).json({success:false,message:'ข้อมูลไม่ครบถ้วน',errors});return;}const data={name:name.trim(),phone:phone.trim(),email:email?.trim(),service:service.trim(),message:message?.trim()};res.status(201).json({success:true,message:'รับข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็ว',data});});
export default router;
