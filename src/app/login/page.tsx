import { Login } from "../components/Login";

export default function LoginPage() {
    return(
        <Login/>
    )
}


// 'use client'

// import { useFormState, useFormStatus } from 'react-dom'
// import { loginAction } from '../actions/auth'
// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   TextInput,
//   PasswordInput,
//   Button,
//   Paper,
//   Title,
//   Text,
//   Box,
// } from '@mantine/core'
// import Link from 'next/link'
// import { notifications } from '@mantine/notifications'

// const initialState = {
//   error: null,
//   success: false,
// }

// function SubmitButton() {
//   const { pending } = useFormStatus()
  
//   return (
//     <Button 
//       fullWidth 
//       mt="xl" 
//       type="submit" 
//       loading={pending}
//     >
//       Войти
//     </Button>
//   )
// }

// export default function LoginPage() {
//   const [state, formAction] = useFormState(loginAction, initialState)
//   const router = useRouter()

//   useEffect(() => {
//     if (state?.error) {
//       notifications.show({
//         title: 'Ошибка',
//         message: state.error,
//         color: 'red',
//       })
//     }
    
//     if (state?.success) {
//       notifications.show({
//         title: 'Успешно',
//         message: 'Вы успешно вошли в систему',
//         color: 'green',
//       })
//       setTimeout(() => router.push('/products'), 1000)
//     }
//   }, [state, router])

//   return (
//     <Box
//       style={{
//         display: 'flex',
//         minHeight: '100vh',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '20px'
//       }}
//     >
//       <Paper
//         radius="md"
//         p="xl"
//         withBorder
//         style={{
//           position: 'relative',
//           width: '100%',
//           maxWidth: 400
//         }}
//       >
//         <Title order={2} mb="md">С возвращением</Title>
        
//         <form action={formAction}>
//           <TextInput
//             required
//             name="phone"
//             label="Телефон"
//             placeholder="998 90 123 45 67"
//             pattern="^998\d{9}$"
//             title="Please enter a valid phone number starting with 998 followed by 9 digits"
//           />
//           <PasswordInput
//             required
//             name="password"
//             label="Пароль"
//             placeholder="Ваш пароль"
//             mt="md"
//           />
//           <SubmitButton />
//         </form>

//         <Text mt="md" size="sm">
//           Нет аккаунта?{' '}
//           <Link href="/register">
//             Зарегистрироваться
//           </Link>
//         </Text>
//         <Text mt="md" size="sm">
//           Хотите вернуться на главную страницу?{' '}
//           <Link href="/products">
//             Назад к продуктам
//           </Link>
//         </Text>
//       </Paper>
//     </Box>
//   )
// }