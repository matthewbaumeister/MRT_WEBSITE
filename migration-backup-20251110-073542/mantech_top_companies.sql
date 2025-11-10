--
-- PostgreSQL database dump
--

\restrict royGqFBldpKHIalsy1huXYW5bjGO2dlauhCIXk3P1azJLlPjLysBAdkkOv2LuPx

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
-- Name: mantech_top_companies; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.mantech_top_companies AS
 SELECT cm.company_name,
    count(DISTINCT cm.project_id) AS projects_involved,
    count(*) FILTER (WHERE (cm.mention_type = 'prime'::text)) AS prime_contracts,
    count(*) FILTER (WHERE (cm.mention_type = 'partner'::text)) AS partnerships,
    string_agg(DISTINCT m.mantech_component, ', '::text) AS components_worked_with
   FROM (public.mantech_company_mentions cm
     JOIN public.mantech_projects m ON ((cm.project_id = m.id)))
  GROUP BY cm.company_name
  ORDER BY (count(DISTINCT cm.project_id)) DESC
 LIMIT 100;


--
-- PostgreSQL database dump complete
--

\unrestrict royGqFBldpKHIalsy1huXYW5bjGO2dlauhCIXk3P1azJLlPjLysBAdkkOv2LuPx

