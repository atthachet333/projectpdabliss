# PDA BLISS COMPANY LIMITED

เว็บไซต์บริษัทบริการเอกสารครบวงจร แยกเป็น React + TypeScript frontend และ Express + TypeScript backend

## เริ่มต้นใช้งาน

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:4546`

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend: `http://localhost:4547`

## คำสั่งสร้างโปรเจกต์จากศูนย์

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install react-router-dom lucide-react && npm install -D tailwindcss@3 postcss autoprefixer
cd .. && mkdir backend && cd backend
npm init -y
npm install express cors helmet dotenv
npm install -D typescript ts-node ts-node-dev @types/node @types/express @types/cors
npx tsc --init
```
