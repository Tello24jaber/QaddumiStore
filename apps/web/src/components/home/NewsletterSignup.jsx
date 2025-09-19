import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const NewsletterSignup = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('يرجى إدخال عنوان البريد الإلكتروني')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('يرجى إدخال عنوان بريد إلكتروني صحيح')
      return
    }

    setIsSubscribing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubscribed(true)
      toast.success('تم الاشتراك بنجاح! سنرسل لك آخر العروض والأخبار')
      setEmail('')
    } catch (error) {
      toast.error('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="container-qaddumi">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-qaddumi-offwhite mb-4">
            {t('footer.newsletter')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('footer.newsletterText')} واحصل على خصم 10% على طلبك الأول
          </p>
        </div>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <EnvelopeIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.subscribeEmail')}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-4 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-qaddumi-gold"
                disabled={isSubscribing || isSubscribed}
              />
            </div>
            <button
              type="submit"
              disabled={isSubscribing || isSubscribed}
              className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
                isSubscribed
                  ? 'bg-green-500 text-white'
                  : 'bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-qaddumi-charcoal'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubscribing ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>جاري الاشتراك...</span>
                </div>
              ) : isSubscribed ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckIcon className="w-5 h-5" />
                  <span>تم الاشتراك</span>
                </div>
              ) : (
                t('footer.subscribe')
              )}
            </button>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-qaddumi-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-qaddumi-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-qaddumi-offwhite mb-2">عروض حصرية</h3>
            <p className="text-gray-300">كن أول من يحصل على العروض والخصومات الخاصة</p>
          </div>

          <div>
            <div className="w-12 h-12 bg-qaddumi-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-qaddumi-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-qaddumi-offwhite mb-2">المنتجات الجديدة</h3>
            <p className="text-gray-300">اكتشف أحدث الأجهزة الكهربائية قبل الجميع</p>
          </div>

          <div>
            <div className="w-12 h-12 bg-qaddumi-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-qaddumi-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-qaddumi-offwhite mb-2">نصائح مفيدة</h3>
            <p className="text-gray-300">نصائح الخبراء حول الصيانة والاستخدام الأمثل</p>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="mt-8 text-sm text-gray-400 max-w-2xl mx-auto">
          نحن نحترم خصوصيتك. لن نشارك بياناتك مع أطراف ثالثة ويمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </div>
  )
}

export default NewsletterSignup