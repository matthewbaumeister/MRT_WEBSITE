--
-- PostgreSQL database dump
--

\restrict 3ikwB2QjJfWEgDgOYxtPRltKzsHaXCGFbLhRdgslt2p95ri2svJQaGfzhXs2nvm

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
-- Name: defense_stock_trades; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.defense_stock_trades AS
 SELECT t.id,
    t.member_name,
    t.chamber,
    t.transaction_date,
    t.disclosure_date,
    t.ticker,
    t.asset_description,
    t.transaction_type,
    t.amount_range,
    d.company_name,
    d.sector,
    d.is_prime_contractor,
    t.filing_url,
    (t.disclosure_date - t.transaction_date) AS days_to_disclose
   FROM (public.congressional_stock_trades t
     LEFT JOIN public.defense_contractors_tickers d ON (((d.ticker)::text = (t.ticker)::text)))
  WHERE ((t.ticker)::text IN ( SELECT defense_contractors_tickers.ticker
           FROM public.defense_contractors_tickers))
  ORDER BY t.transaction_date DESC;


--
-- PostgreSQL database dump complete
--

\unrestrict 3ikwB2QjJfWEgDgOYxtPRltKzsHaXCGFbLhRdgslt2p95ri2svJQaGfzhXs2nvm

