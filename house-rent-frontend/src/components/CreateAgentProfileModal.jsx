import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const steps = [
  'Basic Info',
  'Contact Details',
  'Professional Details',
  'Profile Picture',
  'Review & Submit'
]

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  bio: '',
  years_experience: '',
  specialties: '',
  service_areas: '',
  profile_picture: '',
}

const CreateAgentProfileModal = ({ isOpen, onClose, onProfileCreated }) => {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // TODO: Call API to create agent profile
      if (onProfileCreated) onProfileCreated(form)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Agent Profile</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {steps.map((label, idx) => (
              <div key={label} className={`flex-1 h-2 rounded ${idx <= step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </DialogHeader>
        <div className="py-4">
          {step === 0 && (
            <div className="space-y-4">
              <Input name="full_name" label="Full Name" placeholder="Full Name" value={form.full_name} onChange={handleChange} />
              <Input name="email" label="Email" placeholder="Email" value={form.email} onChange={handleChange} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Input name="phone" label="Phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
              <Input name="company" label="Company" placeholder="Company" value={form.company} onChange={handleChange} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Input name="title" label="Title" placeholder="Title" value={form.title} onChange={handleChange} />
              <Textarea name="bio" label="Bio" placeholder="Short bio" value={form.bio} onChange={handleChange} />
              <Input name="years_experience" label="Years Experience" placeholder="Years of Experience" value={form.years_experience} onChange={handleChange} />
              <Input name="specialties" label="Specialties (comma separated)" placeholder="e.g. Apartments, Condos" value={form.specialties} onChange={handleChange} />
              <Input name="service_areas" label="Service Areas (comma separated)" placeholder="e.g. Downtown, Suburbs" value={form.service_areas} onChange={handleChange} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Input name="profile_picture" label="Profile Picture URL" placeholder="Profile Picture URL" value={form.profile_picture} onChange={handleChange} />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-2">
              <div><strong>Full Name:</strong> {form.full_name}</div>
              <div><strong>Email:</strong> {form.email}</div>
              <div><strong>Phone:</strong> {form.phone}</div>
              <div><strong>Company:</strong> {form.company}</div>
              <div><strong>Title:</strong> {form.title}</div>
              <div><strong>Bio:</strong> {form.bio}</div>
              <div><strong>Years Experience:</strong> {form.years_experience}</div>
              <div><strong>Specialties:</strong> {form.specialties}</div>
              <div><strong>Service Areas:</strong> {form.service_areas}</div>
              <div><strong>Profile Picture:</strong> {form.profile_picture}</div>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAgentProfileModal
