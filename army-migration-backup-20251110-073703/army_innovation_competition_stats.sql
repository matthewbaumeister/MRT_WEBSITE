--
-- PostgreSQL database dump
--

\restrict 7qORlyWdEgkRyzbxgTUQCWf61Vwc7n4pk6vI6BZSBc5lFc8SdCA6eQG1h98Maov

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
-- Name: army_innovation_competition_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.army_innovation_competition_stats AS
 SELECT program_name,
    count(DISTINCT id) AS total_competitions,
    count(DISTINCT id) FILTER (WHERE (status = 'Open'::text)) AS open_competitions,
    count(DISTINCT id) FILTER (WHERE (status = 'Closed'::text)) AS closed_competitions,
    sum(total_prize_pool) AS total_prize_money,
    sum(actual_participants) AS total_participants,
    avg(actual_participants) AS avg_participants_per_competition,
    max(close_date) AS most_recent_close_date
   FROM public.army_innovation_opportunities
  GROUP BY program_name;


--
-- PostgreSQL database dump complete
--

\unrestrict 7qORlyWdEgkRyzbxgTUQCWf61Vwc7n4pk6vI6BZSBc5lFc8SdCA6eQG1h98Maov

