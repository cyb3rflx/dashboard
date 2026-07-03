import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { login } from "@/api/auth"

export function LoginForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault()
      setError("")
      try {
        await login(email, password)
        navigate("/")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed")
      }
    }
  
  return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email} 
                  onChange={e => setEmail(e.currentTarget.value)}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" value={password} 
                  onChange={e => setPassword(e.currentTarget.value)} required />
              </Field>
              <Field>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to={"/register"}>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
  )
}
