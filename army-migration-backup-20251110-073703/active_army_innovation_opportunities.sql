--
-- PostgreSQL database dump
--

\restrict 07iNWCXqRRIKYZ0RIYE1WUwfxLYwgB8bQcebgcIJgx5aISkH4DkaWOoWdcEw6pn

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: active_army_innovation_opportunities; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.active_army_innovation_opportunities AS
 SELECT o.id,
    o.program_id,
    o.program_name,
    o.opportunity_number,
    o.opportunity_title,
    o.opportunity_subtitle,
    o.competition_name,
    o.competition_year,
    o.opportunity_type,
    o.competition_phase,
    o.track_name,
    o.status,
    o.submission_window_status,
    o.announced_date,
    o.open_date,
    o.close_date,
    o.submission_deadline,
    o.evaluation_start_date,
    o.evaluation_end_date,
    o.winner_announcement_date,
    o.award_date,
    o.days_until_close,
    o.days_since_open,
    o.submission_window_days,
    o.description,
    o.problem_statement,
    o.challenge_description,
    o.desired_outcome,
    o.evaluation_criteria,
    o.technology_areas,
    o.naics_codes,
    o.keywords,
    o.modernization_priorities,
    o.capability_gaps,
    o.eligibility_requirements,
    o.eligible_entities,
    o.security_clearance_required,
    o.itar_controlled,
    o.us_citizen_required,
    o.team_size_limit,
    o.total_prize_pool,
    o.prize_structure,
    o.number_of_awards,
    o.min_award_amount,
    o.max_award_amount,
    o.matching_funds_available,
    o.follow_on_funding_potential,
    o.submission_format,
    o.page_limit,
    o.submission_instructions,
    o.required_documents,
    o.optional_documents,
    o.evaluation_stages,
    o.judging_criteria,
    o.review_process_description,
    o.poc_name,
    o.poc_email,
    o.poc_phone,
    o.technical_poc_name,
    o.technical_poc_email,
    o.questions_allowed,
    o.qa_deadline,
    o.pitch_event_date,
    o.pitch_event_location,
    o.pitch_event_virtual,
    o.demo_day_date,
    o.demo_day_location,
    o.opportunity_url,
    o.registration_url,
    o.submission_portal_url,
    o.rules_document_url,
    o.faq_url,
    o.information_session_url,
    o.video_url,
    o.industry_partners,
    o.government_partners,
    o.academic_partners,
    o.transition_partners,
    o.expected_participants,
    o.actual_participants,
    o.submissions_received,
    o.finalists_selected,
    o.winners_selected,
    o.previous_competition_id,
    o.competition_series,
    o.series_iteration,
    o.data_source,
    o.source_url,
    o.last_scraped,
    o.scrape_frequency,
    o.related_sbir_topics,
    o.is_sbir_prize_gateway,
    o.created_at,
    o.last_updated,
    p.program_full_name,
    p.program_website,
        CASE
            WHEN (o.close_date IS NULL) THEN 'Unknown'::text
            WHEN (o.close_date < CURRENT_DATE) THEN 'Closed'::text
            WHEN (o.open_date > CURRENT_DATE) THEN 'Upcoming'::text
            ELSE 'Open'::text
        END AS calculated_status,
    count(DISTINCT d.id) AS document_count,
    count(DISTINCT s.id) AS submission_count
   FROM (((public.army_innovation_opportunities o
     LEFT JOIN public.army_innovation_programs p ON ((o.program_id = p.id)))
     LEFT JOIN public.army_innovation_documents d ON ((o.id = d.opportunity_id)))
     LEFT JOIN public.army_innovation_submissions s ON ((o.id = s.opportunity_id)))
  WHERE (o.status = ANY (ARRAY['Announced'::text, 'Open'::text, 'In_Review'::text]))
  GROUP BY o.id, p.program_full_name, p.program_website;


--
-- PostgreSQL database dump complete
--

\unrestrict 07iNWCXqRRIKYZ0RIYE1WUwfxLYwgB8bQcebgcIJgx5aISkH4DkaWOoWdcEw6pn

