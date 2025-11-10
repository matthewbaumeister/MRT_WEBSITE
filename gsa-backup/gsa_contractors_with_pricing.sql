--
-- PostgreSQL database dump
--

\restrict zmKMcWpJtdi5PbQGJ0lbAbhVbIm1ixkN32b1GsC1Oe79kqIbSkPd62Di5y8kjLa

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
-- Name: gsa_contractors_with_pricing; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.gsa_contractors_with_pricing AS
 SELECT c.id AS contractor_id,
    c.company_name,
    c.contract_number,
    c.primary_sin,
    c.sin_codes,
    c.website,
    c.company_state,
    pl.price_list_url,
    pl.parse_status,
    pl.labor_categories_count,
    pl.parsed_at,
    count(lc.id) AS actual_labor_categories,
    min(lc.hourly_rate) AS min_hourly_rate,
    max(lc.hourly_rate) AS max_hourly_rate,
    avg(lc.hourly_rate) AS avg_hourly_rate
   FROM ((public.gsa_schedule_holders c
     LEFT JOIN public.gsa_price_lists pl ON ((c.id = pl.contractor_id)))
     LEFT JOIN public.gsa_labor_categories lc ON ((c.id = lc.contractor_id)))
  GROUP BY c.id, c.company_name, c.contract_number, c.primary_sin, c.sin_codes, c.website, c.company_state, pl.price_list_url, pl.parse_status, pl.labor_categories_count, pl.parsed_at;


--
-- Name: VIEW gsa_contractors_with_pricing; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.gsa_contractors_with_pricing IS 'Shows contractors with their pricing status and rate ranges';


--
-- PostgreSQL database dump complete
--

\unrestrict zmKMcWpJtdi5PbQGJ0lbAbhVbIm1ixkN32b1GsC1Oe79kqIbSkPd62Di5y8kjLa

