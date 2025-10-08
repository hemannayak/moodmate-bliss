import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/lib/api';
import { toast } from 'sonner';
import { User, Camera, Upload, X, Save, Mail, Phone, MapPin, Calendar, Trash2, Shield, Brain, Eye, EyeOff, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    avatar: '',
    photo: '',
    privacy: {
      allowAIJournalAnalysis: true,
      allowAIMoodAnalysis: true,
      dataSharing: false
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.get();
      if (data.profile) {
        setProfile({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          displayName: data.profile.displayName || '',
          bio: data.profile.bio || '',
          dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
          gender: data.profile.gender || '',
          phone: data.profile.phone || '',
          location: data.profile.location || { city: '', state: '', country: '' },
          avatar: data.profile.avatar || '',
          photo: data.profile.photo || '',
          privacy: data.profile.privacy || {
            allowAIJournalAnalysis: true,
            allowAIMoodAnalysis: true,
            dataSharing: false
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile(prev => ({
          ...prev,
          [type]: base64
        }));
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Photo'} uploaded!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type: 'avatar' | 'photo') => {
    setProfile(prev => ({
      ...prev,
      [type]: ''
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileAPI.update(profile);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar and Photo Section */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          Profile Pictures
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar */}
          <div>
            <Label className="text-base mb-2 block">Avatar</Label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-muted">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {profile.avatar && (
                  <button
                    onClick={() => handleRemoveImage('avatar')}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'avatar')}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => avatarInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Avatar
              </Button>
            </div>
          </div>

          {/* Photo */}
          <div>
            <Label className="text-base mb-2 block">Cover Photo</Label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Cover"
                    className="w-full h-32 rounded-lg object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center border-4 border-muted">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {profile.photo && (
                  <button
                    onClick={() => handleRemoveImage('photo')}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'photo')}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Personal Information
        </h2>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="John"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              name="displayName"
              value={profile.displayName}
              onChange={handleChange}
              placeholder="How you want to be called"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="mt-2 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {profile.bio.length}/500 characters
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Contact Information
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              value={user?.email}
              disabled
              className="mt-2 bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+91 1234567890"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Location
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="location.city">City</Label>
            <Input
              id="location.city"
              name="location.city"
              value={profile.location.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              className="mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location.state">State</Label>
              <Input
                id="location.state"
                name="location.state"
                value={profile.location.state}
                onChange={handleChange}
                placeholder="Telangana"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location.country">Country</Label>
              <Input
                id="location.country"
                name="location.country"
                value={profile.location.country}
                onChange={handleChange}
                placeholder="India"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Privacy & AI Settings
        </h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold">AI Journal Analysis</h3>
                  <p className="text-sm text-muted-foreground">Get AI-powered insights and suggestions for your journal entries</p>
                </div>
              </div>
              <Switch
                checked={profile.privacy.allowAIJournalAnalysis}
                onCheckedChange={(checked) =>
                  setProfile(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, allowAIJournalAnalysis: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">AI Mood Pattern Analysis</h3>
                  <p className="text-sm text-muted-foreground">Receive AI insights about your mood patterns and trends</p>
                </div>
              </div>
              <Switch
                checked={profile.privacy.allowAIMoodAnalysis}
                onCheckedChange={(checked) =>
                  setProfile(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, allowAIMoodAnalysis: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-orange-500" />
                <div>
                  <h3 className="font-semibold">Data Sharing</h3>
                  <p className="text-sm text-muted-foreground">Allow anonymized data to improve AI models (optional)</p>
                </div>
              </div>
              <Switch
                checked={profile.privacy.dataSharing}
                onCheckedChange={(checked) =>
                  setProfile(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataSharing: checked }
                  }))
                }
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Privacy Notice</p>
                <p>Your journal entries and mood data are always kept private and secure. AI analysis happens locally and your personal data is never shared with third parties without your explicit consent.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white gap-2"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
