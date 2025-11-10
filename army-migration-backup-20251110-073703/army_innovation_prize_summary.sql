--
-- PostgreSQL database dump
--

\restrict srTrRmFZvTpSig52ydcmF3BLQmqOc0kzgRKJ5KeBtRqDQ7bIgMmr5hw9rJiknKr

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
-- Name: army_innovation_prize_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.army_innovation_prize_summary AS
 SELECT id,
    opportunity_title,
    program_name,
    competition_name,
    total_prize_pool,
    number_of_awards,
    max_award_amount,
    status,
    close_date,
    technology_areas,
    opportunity_url
   FROM public.army_innovation_opportunities o
  WHERE (total_prize_pool IS NOT NULL)
  ORDER BY total_prize_pool DESC;


--
-- PostgreSQL database dump complete
--

\unrestrict srTrRmFZvTpSig52ydcmF3BLQmqOc0kzgRKJ5KeBtRqDQ7bIgMmr5hw9rJiknKr

