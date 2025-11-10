--
-- PostgreSQL database dump
--

\restrict b5UM4BvmSrc3Fotc8On4re92VeL8AJ0o6ab8fshMKqFYs6AfeTFE5aKbYjbZdai

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
-- Name: army_innovation_winners_with_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.army_innovation_winners_with_details AS
 SELECT s.id AS submission_id,
    s.company_name,
    s.company_location,
    s.submission_status,
    s.award_amount AS individual_award,
    s.phase,
    s.public_abstract,
    o.id AS opportunity_id,
    o.opportunity_title AS competition_title,
    o.competition_name,
    o.competition_year,
    o.competition_phase,
    o.status AS competition_status,
    o.total_prize_pool AS competition_total_prize,
    o.max_award_amount AS competition_max_award,
    o.number_of_awards AS competition_total_awards,
    o.open_date,
    o.close_date,
    o.winner_announcement_date,
    o.opportunity_url AS competition_url,
    s.created_at AS winner_recorded_at
   FROM (public.army_innovation_submissions s
     JOIN public.army_innovation_opportunities o ON ((s.opportunity_id = o.id)))
  WHERE (s.submission_status = 'Winner'::text)
  ORDER BY o.opportunity_title, s.company_name;


--
-- PostgreSQL database dump complete
--

\unrestrict b5UM4BvmSrc3Fotc8On4re92VeL8AJ0o6ab8fshMKqFYs6AfeTFE5aKbYjbZdai

