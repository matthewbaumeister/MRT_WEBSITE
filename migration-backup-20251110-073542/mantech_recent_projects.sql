--
-- PostgreSQL database dump
--

\restrict BmE0LLEEExUrYciJhkP0lyUsiFXjUZntIJoixcpyfxgAinMzXTrh9Ddf0JxoMJf

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
-- Name: mantech_recent_projects; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.mantech_recent_projects AS
 SELECT id,
    article_title,
    mantech_component,
    project_name,
    technology_focus,
    companies_involved,
    prime_contractor,
    transition_stage,
    funding_amount,
    published_date,
    article_url
   FROM public.mantech_projects
  WHERE ((published_date >= (CURRENT_DATE - '90 days'::interval)) OR ((published_date IS NULL) AND (scraped_at >= (now() - '90 days'::interval))))
  ORDER BY COALESCE(published_date, (scraped_at)::date) DESC;


--
-- PostgreSQL database dump complete
--

\unrestrict BmE0LLEEExUrYciJhkP0lyUsiFXjUZntIJoixcpyfxgAinMzXTrh9Ddf0JxoMJf

