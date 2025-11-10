--
-- PostgreSQL database dump
--

\restrict 3bFGKREIgGa5iyMDQiI58IhiGVlJ2caIrg6H3gtOVd6CyiblLn7asofD8vICW4L

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
-- Name: army_innovation_upcoming_deadlines; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.army_innovation_upcoming_deadlines AS
 SELECT o.id,
    o.opportunity_title,
    o.program_name,
    o.competition_name,
    o.close_date,
    o.submission_deadline,
    o.total_prize_pool,
    o.opportunity_url,
    (o.close_date - CURRENT_DATE) AS days_until_close,
    p.program_website
   FROM (public.army_innovation_opportunities o
     LEFT JOIN public.army_innovation_programs p ON ((o.program_id = p.id)))
  WHERE ((o.status = 'Open'::text) AND (o.close_date IS NOT NULL) AND (o.close_date >= CURRENT_DATE))
  ORDER BY o.close_date;


--
-- PostgreSQL database dump complete
--

\unrestrict 3bFGKREIgGa5iyMDQiI58IhiGVlJ2caIrg6H3gtOVd6CyiblLn7asofD8vICW4L

