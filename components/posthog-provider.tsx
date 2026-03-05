'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: '/ingest',
                ui_host: 'https://us.posthog.com',
                person_profiles: 'identified_only',
                capture_pageview: false,
                capture_pageleave: true,
                scroll_root_selector: ['main'],
                autocapture: {
                    dom_event_allowlist: ['click', 'submit'],
                    element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
                    css_selector_allowlist: ['[data-ph-capture]'],
                },
                session_recording: {
                    maskAllInputs: false,
                    maskInputOptions: { password: true },
                },
            })
        }
    }, [])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
