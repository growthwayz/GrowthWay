from typing import Literal, Annotated
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

Text = Annotated[str, Field(max_length=10000)]
Short = Annotated[str, Field(max_length=240)]
Slug = Annotated[str, Field(pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$', max_length=120)]
STATUS = Literal['New', 'Contacted', 'Proposal', 'Won', 'Lost']

class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)

class ContentBase(Strict):
    published: bool = False
    order: int = Field(default=0, ge=0, le=10000)
    isPlaceholder: bool = False
    seoTitle: Short = ''
    seoDescription: Annotated[str, Field(max_length=320)] = ''
    seoImage: Short = ''

class ProjectInDB(ContentBase):
    slug: Slug
    title: Annotated[str, Field(min_length=1, max_length=240)]
    client: Short = ''
    industry: Short = ''
    categories: list[Slug] = Field(default_factory=list, max_length=20)
    services: list[Slug] = Field(default_factory=list, max_length=20)
    coverImage: Annotated[str, Field(max_length=2000)] = ''
    coverImageAlt: Short = ''
    gallery: list[Annotated[str, Field(max_length=2000)]] = Field(default_factory=list, max_length=40)
    galleryCaptions: list[Short] = Field(default_factory=list, max_length=40)
    galleryAlts: list[Short] = Field(default_factory=list, max_length=40)
    videoUrl: Annotated[str, Field(max_length=2000)] = ''
    challenge: Text = ''
    strategy: Text = ''
    execution: Text = ''
    results: list[dict[str, Short]] = Field(default_factory=list, max_length=20)
    featured: bool = False
    experienceLabel: Literal['Growthway Project', 'Selected Experience', 'Previous Work'] = 'Selected Experience'
    attribution: Short = ''
    permissionApproved: bool = False
    resultsVerified: bool = False
    year: Short = ''
    location: Short = ''

class ServiceInDB(ContentBase):
    slug: Slug
    title: Annotated[str, Field(min_length=1, max_length=240)]
    description: Text = ''
    capabilities: list[Short] = Field(default_factory=list, max_length=30)
    image: Annotated[str, Field(max_length=2000)] = ''
    imageAlt: Short = ''
    videoUrl: Annotated[str, Field(max_length=2000)] = ''

class IndustryInDB(ContentBase):
    slug: Slug
    name: Annotated[str, Field(min_length=1, max_length=240)]
    shortLine: Text = ''
    image: Annotated[str, Field(max_length=2000)] = ''
    imageAlt: Short = ''

class CategoryInDB(ContentBase):
    slug: Slug
    name: Annotated[str, Field(min_length=1, max_length=240)]

class ClientInDB(ContentBase):
    name: Annotated[str, Field(min_length=1, max_length=240)]
    logo: Annotated[str, Field(max_length=2000)] = ''
    logoAlt: Short = ''
    url: Annotated[str, Field(max_length=2000)] = ''
    approved: bool = False

class TestimonialInDB(ContentBase):
    quote: Annotated[str, Field(min_length=1, max_length=2000)]
    personName: Annotated[str, Field(min_length=1, max_length=240)]
    role: Short = ''
    brand: Short = ''
    logo: Annotated[str, Field(max_length=2000)] = ''
    permissionApproved: bool = False

class TeamMemberInDB(ContentBase):
    name: Annotated[str, Field(min_length=1, max_length=240)]
    role: Short
    photo: Annotated[str, Field(max_length=2000)] = ''
    photoAlt: Short = ''
    bio: Text = ''
    verified: bool = False

class WhyGrowthwayItem(Strict):
    word: Short
    line: Short
class WhyGrowthway(Strict):
    intro: Text = ''
    items: list[WhyGrowthwayItem] = Field(default_factory=list, max_length=12)
class ProcessStep(Strict):
    title: Short
    description: Text
class HeroSettings(Strict):
    headline: Short = 'Built for what’s next.'
    statement: Text = 'New agency. Real experience. Built for what’s next.'
    description: Text = 'Growthway brings strategy, content, design and digital experiences together to help brands move forward.'
    videoUrl: Annotated[str, Field(max_length=2000)] = ''
    poster: Annotated[str, Field(max_length=2000)] = ''
    posterAlt: Short = ''
    videoPermissionApproved: bool = False
class SiteSettingsOut(Strict):
    whatsappNumber: Annotated[str, Field(pattern=r'^\+?\d{8,15}$|^$')] = ''
    email: Short = ''
    instagram: Annotated[str, Field(max_length=2000)] = ''
    linkedin: Annotated[str, Field(max_length=2000)] = ''
    youtube: Annotated[str, Field(max_length=2000)] = ''
    behance: Annotated[str, Field(max_length=2000)] = ''
    phone: Short = ''
    address: Short = ''
    siteUrl: Annotated[str, Field(max_length=2000)] = ''
    searchConsoleVerification: Short = ''
    gaMeasurementId: Annotated[str, Field(pattern=r'^G-[A-Z0-9]+$|^$')] = ''
    seoTitle: Short = 'Growthway — Strategy, Content & Digital Growth'
    seoDescription: Annotated[str, Field(max_length=320)] = 'New agency. Real experience. Strategy, content, design and digital growth for ambitious brands.'
    ogImage: Annotated[str, Field(max_length=2000)] = ''
    hero: HeroSettings = Field(default_factory=HeroSettings)
    whyGrowthway: WhyGrowthway = Field(default_factory=WhyGrowthway)
    process: list[ProcessStep] = Field(default_factory=list, max_length=10)
    privacyText: Text = 'We use the contact details and project information you submit to respond to your enquiry and discuss your project. Please do not include sensitive personal information. Contact us using the details on this website to request a correction or deletion.'
    termsText: Text = 'Project scope, fees, timelines and usage rights are agreed separately before work begins. Portfolio work may include previous engagements and is credited where applicable.'
    @field_validator('email')
    @classmethod
    def valid_email(cls, value):
        if value:
            from pydantic import TypeAdapter
            return str(TypeAdapter(EmailStr).validate_python(value))
        return value

class LeadCreate(Strict):
    name: Annotated[str, Field(min_length=2, max_length=120)]
    brand: Annotated[str, Field(min_length=1, max_length=160)]
    email: EmailStr
    phone: Annotated[str, Field(pattern=r'^\+?[0-9 ()-]{7,25}$|^$')] | None = None
    businessType: Short = 'other'
    servicesNeeded: list[Slug] = Field(min_length=1, max_length=20)
    budgetRange: Short | None = None
    timeline: Short | None = None
    projectDescription: Annotated[str, Field(min_length=10, max_length=6000)]
    consent: bool
    website_fax_hp: Annotated[str, Field(max_length=200)] = ''
    source: Short = 'website'
    pageUrl: Annotated[str, Field(max_length=2000)] = ''
    referrer: Annotated[str, Field(max_length=2000)] = ''
    utmSource: Short = ''
    utmMedium: Short = ''
    utmCampaign: Short = ''
    utmTerm: Short = ''
    utmContent: Short = ''
class LeadStatusUpdate(Strict):
    status: STATUS
    note: Annotated[str, Field(max_length=2000)] = ''
    revision: int = Field(ge=1)
class PasswordChange(Strict):
    currentPassword: str
    newPassword: Annotated[str, Field(min_length=12, max_length=200)]
class AdminCreate(Strict):
    username: Annotated[str, Field(pattern=r'^[a-zA-Z0-9._@-]{3,120}$')]
    password: Annotated[str, Field(min_length=12, max_length=200)]
    role: Literal['admin', 'editor'] = 'editor'
class MediaEdit(Strict):
    alt: Short = ''
    caption: Short = ''
class EventCreate(Strict):
    name: Literal['page_view', 'whatsapp_click', 'project_cta_click', 'service_cta_click']
    path: Annotated[str, Field(max_length=500)] = '/'
    utmSource: Short = ''
    utmCampaign: Short = ''

CONTENT_MODELS = {'projects': ProjectInDB, 'services': ServiceInDB, 'industries': IndustryInDB, 'categories': CategoryInDB, 'clients': ClientInDB, 'testimonials': TestimonialInDB, 'team': TeamMemberInDB}
