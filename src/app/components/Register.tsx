'use client'
import React, { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Paper,
  Title,
  Container,
  Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

const LazyDateInput = dynamic(() => import('@mantine/dates').then(module => module.DateInput), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default function AuthFlow() {
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    date_of_birth: null as Date | null,
    gender: 'male' as 'male' | 'female',
    otp: ''
  });

  const validateForm = (values: typeof formValues) => {
    const errors: Partial<Record<keyof typeof formValues, string>> = {};
    if (!values.first_name) errors.first_name = 'First name is required';
    if (!values.last_name) errors.last_name = 'Last name is required';
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!values.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^998[0-9]{9}$/.test(values.phone)) {
      errors.phone = 'Phone must start with 998 and be 12 digits long';
    }
    if (!values.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (step === 'verify' && !values.otp) errors.otp = 'Verification code is required';
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormValues(prev => ({ ...prev, date_of_birth: date }));
  };

  const handleGenderChange = (value: string | null) => {
    if (value) {
      setFormValues(prev => ({ ...prev, gender: value as 'male' | 'female' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formValues);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      if (step === 'register') {
        const response = await fetch('https://globus-nukus.uz/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formValues,
            date_of_birth: formValues.date_of_birth?.toISOString().split('T')[0],
          }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        notifications.show({
          title: 'Success',
          message: 'Verification code has been sent to your phone',
          color: 'green',
        });

        setStep('verify');
      } else {
        const response = await fetch('https://globus-nukus.uz/api/users/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: formValues.phone,
            otp: formValues.otp,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errMessage || 'Verification failed');
        }

        localStorage.setItem('accessToken', data.data.token.access);
        localStorage.setItem('refreshToken', data.data.token.refresh);

        notifications.show({
          title: 'Success',
          message: 'Verification successful',
          color: 'green',
        });

        router.push('/products');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Operation failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" my={40}>
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} mb="lg" ta="center">
          {step === 'register' ? 'Create Account' : 'Verify Phone Number'}
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            {step === 'register' ? (
              <>
                <TextInput
                  required
                  label="First Name"
                  placeholder="Your first name"
                  name="first_name"
                  value={formValues.first_name}
                  onChange={handleInputChange}
                />

                <TextInput
                  required
                  label="Last Name"
                  placeholder="Your last name"
                  name="last_name"
                  value={formValues.last_name}
                  onChange={handleInputChange}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                />

                <TextInput
                  required
                  label="Phone"
                  placeholder="998901234567"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                />

                <Suspense fallback={<div>Loading...</div>}>
                  <LazyDateInput
                    required
                    label="Date of Birth"
                    placeholder="Pick a date"
                    value={formValues.date_of_birth}
                    onChange={handleDateChange}
                  />
                </Suspense>

                <Select
                  required
                  label="Gender"
                  placeholder="Select gender"
                  data={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                  value={formValues.gender}
                  onChange={handleGenderChange}
                />
              </>
            ) : (
              <TextInput
                required
                label="Verification Code"
                placeholder="Enter the code sent to your phone"
                name="otp"
                value={formValues.otp}
                onChange={handleInputChange}
              />
            )}

            <Button type="submit" loading={loading}>
              {step === 'register'
                ? loading ? 'Creating Account...' : 'Create Account'
                : loading ? 'Verifying...' : 'Verify'}
            </Button>

            {step === 'verify' && (
              <Button variant="subtle" onClick={() => setStep('register')}>
                Back to Registration
              </Button>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}