--
-- PostgreSQL database dump
--

\restrict 5GKTeFbFTDO6kdTKOYeQdkad1vAJ8eqAXYCOnt0YJYo77msSL0ErxtgWU6LpJ7Y

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
-- Name: small_business_gsa_holders; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.small_business_gsa_holders AS
 SELECT id,
    contract_number,
    schedule_number,
    sin_codes,
    primary_sin,
    company_name,
    vendor_duns,
    vendor_uei,
    vendor_cage_code,
    company_address,
    company_city,
    company_state,
    company_zip,
    company_country,
    primary_contact_name,
    primary_contact_phone,
    primary_contact_email,
    website,
    contract_start_date,
    contract_expiration_date,
    option_years,
    is_active,
    small_business,
    woman_owned,
    veteran_owned,
    service_disabled_veteran_owned,
    hubzone,
    eight_a_program,
    service_offerings,
    pricing_data,
    labor_categories,
    geographic_scope,
    states_served,
    naics_codes,
    primary_naics,
    total_sales_reported,
    industrial_funding_fee_paid,
    data_source,
    source_url,
    last_scraped,
    last_verified,
    created_at,
    updated_at
   FROM public.gsa_schedule_holders
  WHERE ((small_business = true) AND (is_active = true));


--
-- PostgreSQL database dump complete
--

\unrestrict 5GKTeFbFTDO6kdTKOYeQdkad1vAJ8eqAXYCOnt0YJYo77msSL0ErxtgWU6LpJ7Y

