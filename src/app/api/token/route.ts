import { NextResponse } from 'next/server';
import { api } from '@/app/api/axios/axios';

export async function POST(request: Request) {
  const { phone, password } = await request.json();

  try {
    const response = await api.post('/token', { phone, password });
    if (response.data.success) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ success: false, errMessage: response.data.errMessage }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, errMessage: 'Login failed' }, { status: 500 });
  }
}
