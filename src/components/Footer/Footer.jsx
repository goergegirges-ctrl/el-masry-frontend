import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import logoLight from '@/assets/logo-horizontal-light.svg'
import { useLanguage } from '@/context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">

        {/* ── Column 1 · Brand ───────────────────────────── */}
        <div className="footer-col footer-col--brand">
          <Link to="/" aria-label="El-Masry Electronics — الرئيسية">
            <img
              src={logoLight}
              alt="El-Masry Electronics"
              className="footer-logo"
            />
          </Link>

          <p className="footer-tagline">
            "El-Masry for Screen Parts &amp; Electronics — وجهتك الأولى لقطع الغيار والإلكترونيات."
          </p>

          <div className="footer-social" aria-label="وسائل التواصل الاجتماعي / Social media">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/elmasryelectronics"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
            >
              {/* Facebook SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/201031451015"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="WhatsApp"
            >
              {/* WhatsApp SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.997 0C5.373 0 0 5.373 0 11.997c0 2.117.554 4.1 1.522 5.822L.057 23.487a.5.5 0 00.613.613l5.657-1.465A11.942 11.942 0 0011.997 24C18.62 24 24 18.627 24 11.997 24 5.373 18.62 0 11.997 0zm0 21.818a9.82 9.82 0 01-5.012-1.371l-.36-.213-3.714.963.985-3.608-.235-.372A9.82 9.82 0 012.18 11.997c0-5.413 4.405-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.821-9.818 9.821z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Column 2 · Company ─────────────────────────── */}
        <div className="footer-col footer-col--links">
          <h3 className="footer-col-title">{t('footer_company')}</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link footer-link--active">{t('footer_home')}</Link>
            </li>
            <li>
              <span className="footer-link footer-link--inactive">{t('footer_about')}</span>
            </li>
            <li>
              <span className="footer-link footer-link--inactive">{t('footer_delivery')}</span>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">{t('footer_privacy')}</Link>
            </li>
          </ul>
        </div>

        {/* ── Column 3 · Get In Touch ────────────────────── */}
        <div className="footer-col footer-col--contact">
          <h3 className="footer-col-title">{t('footer_getInTouch')}</h3>
          <ul className="footer-links">
            <li>
              <a href="tel:+201031451015" className="footer-link footer-phone">
                <span className="footer-phone-icon" aria-hidden="true">
                  {/* WhatsApp icon inline */}
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.997 0C5.373 0 0 5.373 0 11.997c0 2.117.554 4.1 1.522 5.822L.057 23.487a.5.5 0 00.613.613l5.657-1.465A11.942 11.942 0 0011.997 24C18.62 24 24 18.627 24 11.997 24 5.373 18.62 0 11.997 0zm0 21.818a9.82 9.82 0 01-5.012-1.371l-.36-.213-3.714.963.985-3.608-.235-.372A9.82 9.82 0 012.18 11.997c0-5.413 4.405-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.821-9.818 9.821z"/>
                  </svg>
                </span>
                +20 103 145 1015
              </a>
            </li>
            <li>
              <a href="tel:+201229424078" className="footer-link footer-phone">
                <span className="footer-phone-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.997 0C5.373 0 0 5.373 0 11.997c0 2.117.554 4.1 1.522 5.822L.057 23.487a.5.5 0 00.613.613l5.657-1.465A11.942 11.942 0 0011.997 24C18.62 24 24 18.627 24 11.997 24 5.373 18.62 0 11.997 0zm0 21.818a9.82 9.82 0 01-5.012-1.371l-.36-.213-3.714.963.985-3.608-.235-.372A9.82 9.82 0 012.18 11.997c0-5.413 4.405-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.821-9.818 9.821z"/>
                  </svg>
                </span>
                +20 122 942 4078
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          Copyright 2026 © El-Masry-Electronics.com — {t('footer_rights')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
