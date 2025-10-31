import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Niche Navigator team',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4">Contact Us</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let&apos;s Start a Conversation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? Need help? Want to partner with us? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto mb-16">
        {/* Contact Information Cards */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <Mail className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>Get a response within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">support@nichenavigator.com</p>
              <p className="text-sm text-muted-foreground mt-1">For general inquiries</p>
              <p className="text-sm font-medium mt-3">sales@nichenavigator.com</p>
              <p className="text-sm text-muted-foreground mt-1">For sales and partnerships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Call Us</CardTitle>
              <CardDescription>Mon-Fri from 9am to 6pm EST</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mt-1">North America</p>
              <p className="text-sm font-medium mt-3">+44 20 1234 5678</p>
              <p className="text-sm text-muted-foreground mt-1">Europe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Visit Us</CardTitle>
              <CardDescription>Our headquarters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                123 Tech Street<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Available during business hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team in real-time
              </p>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="privacy" className="text-sm text-muted-foreground font-normal">
                    I agree to the processing of my personal data for the purpose of responding to my inquiry.
                    Read our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">How quickly will I get a response?</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days.
                  For urgent matters, please use our live chat or call us directly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Do you offer technical support?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! All paid plans include email support. Premium and Enterprise plans
                  include priority support with faster response times.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Can I schedule a demo?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Contact our sales team at sales@nichenavigator.com or fill out the
                  form above to schedule a personalized demo of Niche Navigator.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Do you offer custom development?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer custom development services for Enterprise clients.
                  Contact us to discuss your specific requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Prefer to Connect on Social Media?</CardTitle>
            <CardDescription>
              Follow us for updates, tips, and community discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" asChild>
                <a href="https://twitter.com/nichenavigator" target="_blank" rel="noopener noreferrer">
                  Twitter / X
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/nichenavigator" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://linkedin.com/company/nichenavigator" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://discord.gg/nichenavigator" target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
