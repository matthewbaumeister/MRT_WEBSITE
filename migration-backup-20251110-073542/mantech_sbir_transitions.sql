--
-- PostgreSQL database dump
--

\restrict eI0Ho2TPHX91D9wlvyMEzXMnH2qKh0NYKBdV3DYFXJwkNBMPGMS9bOKBEZA6l2H

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
-- Name: mantech_sbir_transitions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.mantech_sbir_transitions AS
 SELECT m.id AS mantech_project_id,
    m.article_title AS mantech_article_title,
    m.mantech_component,
    m.sbir_company_name,
    m.sbir_topic_number AS mantech_sbir_topic_ref,
    m.technology_focus AS mantech_technology_focus,
    m.transition_stage,
    m.published_date AS mantech_published_date,
    m.funding_amount AS mantech_funding,
    m.prime_contractor,
    m.weapon_systems,
    m.platforms,
    s.id AS sbir_id,
    s.topic_number AS sbir_topic_number,
    s.topic_id AS sbir_topic_id,
    s.cycle_name AS sbir_cycle_name,
    s.title AS sbir_topic_title,
    s.status AS sbir_status,
    s.sponsor_component AS sbir_component,
    s.solicitation_branch AS sbir_solicitation_branch,
    s.open_date AS sbir_open_date,
    s.close_date AS sbir_close_date,
    s.technology_areas AS sbir_technology_areas,
    s.keywords AS sbir_keywords,
    s.description AS sbir_description,
    s.objective AS sbir_objective,
    s.phases_available AS sbir_phases,
    s.is_xtech AS sbir_is_xtech,
    s.urgency_level AS sbir_urgency,
    s.proposal_window_status AS sbir_proposal_status,
    s.has_awards AS sbir_has_awards,
    s.total_awards AS sbir_total_awards,
    s.total_award_funding AS sbir_total_funding
   FROM (public.mantech_projects m
     LEFT JOIN public.sbir_final s ON ((m.sbir_topic_number = s.topic_number)))
  WHERE (m.sbir_linked = true)
  ORDER BY m.published_date DESC;


--
-- PostgreSQL database dump complete
--

\unrestrict eI0Ho2TPHX91D9wlvyMEzXMnH2qKh0NYKBdV3DYFXJwkNBMPGMS9bOKBEZA6l2H

