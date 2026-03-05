'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from 'posthog-js/react';

function getPageMeta(pathname: string) {
  const segments = pathname.replace(/^\/en/, '').split('/').filter(Boolean);
  const props: Record<string, string> = {};

  const section = segments[0];
  if (section) props.content_section = section;

  if (section === 'articoli' && segments.length >= 3) {
    props.content_type = 'article';
    props.content_category = segments[1];
    props.content_slug = segments[2];
  } else if (section === 'ricette' && segments.length >= 3) {
    props.content_type = 'recipe';
    props.content_category = segments[1];
    props.content_slug = segments[2];
  } else if (section === 'servizi' && segments[1] === 'protocolli' && segments[2]) {
    props.content_type = 'protocol';
    props.content_slug = segments[2];
  } else if (section === 'calcolo-longevita') {
    props.content_type = 'tool';
    props.tool_name = 'longevity_calculator';
  } else if (section === 'servizi' && segments[1] === 'assessment-online') {
    props.content_type = 'tool';
    props.tool_name = 'screening_wizard';
  } else if (section === 'glossario') {
    props.content_type = 'glossary';
  } else if (section === 'login') {
    props.content_type = 'auth';
  } else if (!section) {
    props.content_type = 'home';
  }

  props.locale = pathname.startsWith('/en') ? 'en' : 'it';

  return props;
}

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        '$current_url': url,
        ...getPageMeta(pathname),
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
