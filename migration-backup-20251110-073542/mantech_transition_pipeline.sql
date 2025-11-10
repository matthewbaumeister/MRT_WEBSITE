--
-- PostgreSQL database dump
--

\restrict HwiwfEDzUnvqXcxGaFlGGBmfUR7yXsgh3a423MyDw1bb61WF0yR5ybKDrbofZ44

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
-- Name: mantech_transition_pipeline; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.mantech_transition_pipeline AS
 SELECT transition_stage,
    mantech_component,
    count(*) AS projects,
    count(DISTINCT prime_contractor) AS companies,
    avg(technology_readiness_level) AS avg_trl,
    avg(manufacturing_readiness_level) AS avg_mrl
   FROM public.mantech_projects
  WHERE (transition_stage IS NOT NULL)
  GROUP BY transition_stage, mantech_component
  ORDER BY
        CASE transition_stage
            WHEN 'research'::text THEN 1
            WHEN 'development'::text THEN 2
            WHEN 'prototype'::text THEN 3
            WHEN 'production'::text THEN 4
            WHEN 'fielded'::text THEN 5
            ELSE 6
        END, mantech_component;


--
-- PostgreSQL database dump complete
--

\unrestrict HwiwfEDzUnvqXcxGaFlGGBmfUR7yXsgh3a423MyDw1bb61WF0yR5ybKDrbofZ44

