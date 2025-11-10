--
-- PostgreSQL database dump
--

\restrict qnjAICx4YlvDfkcib4AzNGovCP6Ic38OSQhErgJeUkwOxsxiEMlQXkDcQQbRyvp

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
-- Name: mantech_by_component; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.mantech_by_component AS
 SELECT mantech_component,
    count(*) AS total_projects,
    count(*) FILTER (WHERE (transition_stage = 'production'::text)) AS in_production,
    count(*) FILTER (WHERE (sbir_linked = true)) AS sbir_linked_projects,
    count(DISTINCT prime_contractor) FILTER (WHERE (prime_contractor IS NOT NULL)) AS unique_contractors,
    sum(funding_amount) AS total_funding
   FROM public.mantech_projects
  GROUP BY mantech_component
  ORDER BY (count(*)) DESC;


--
-- PostgreSQL database dump complete
--

\unrestrict qnjAICx4YlvDfkcib4AzNGovCP6Ic38OSQhErgJeUkwOxsxiEMlQXkDcQQbRyvp

