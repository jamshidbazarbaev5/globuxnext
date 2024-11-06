'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface LoginState {
  error: string | null;
  success: boolean;
}

export async function loginAction(prevState: LoginState, formData: FormData) {
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  try {
    const response = await fetch('https://globus-nukus.uz/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.errMessage || 'Login failed. Please check your credentials.',
        success: false
      }
    }

    if (data.success) {
      const cookieStore = cookies()
      cookieStore.set('token', data.data.token.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 1 day
      })
      
      cookieStore.set('refreshToken', data.data.token.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 
      })

      return { 
        success: true,
        error: null
      }
    }

    return {
      error: 'Login failed. Please try again.',
      success: false
    }
  } catch (error) {
    return {
      error: 'An unexpected error occurred. Please try again later.',
      success: false
    }
  }
}
