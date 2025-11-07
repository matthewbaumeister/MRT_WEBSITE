# Domain Transfer from Wix to Vercel

## Understanding Your Options

You have **two options** for moving your domain:

### Option 1: Point DNS to Vercel (Recommended - Faster)
- Keep domain registered with Wix (or whoever it's registered with)
- Just change where it points (DNS records)
- Takes 1-48 hours
- **Recommended approach** - simpler and faster

### Option 2: Transfer Domain Registration Away from Wix
- Move the domain registration to another registrar (Namecheap, Google Domains, etc.)
- Then point it to Vercel
- Takes 5-7 days due to transfer locks
- More complex but gives you full control

**I recommend Option 1** - it's faster and works perfectly fine. You can always transfer the registration later if you want.

---

## Option 1: Point DNS to Vercel (Recommended)

### Step 1: Find Out Where Your Domain Is Registered

Your domain might be registered with:
- Wix directly
- A separate registrar (GoDaddy, Namecheap, Google Domains, etc.)

**To check:**
1. Go to [whois.com](https://whois.com)
2. Enter your domain name
3. Look for "Registrar" - this tells you who owns it

### Step 2: Deploy Your Site to Vercel First

Before touching your domain:

```bash
# Deploy to Vercel (you'll get a temporary URL)
cd /Users/matthewbaumeister/Documents/MRT_WEBSITE
npm install
npm run build

# If build succeeds, proceed with Vercel deployment
```

1. Push code to GitHub (see GIT_SETUP.md)
2. Deploy to Vercel
3. You'll get a URL like: `mrt-website.vercel.app`
4. **Test this URL thoroughly** before changing domain

### Step 3: Add Your Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain: `make-ready-consulting.com`
5. Also add: `www.make-ready-consulting.com`

Vercel will show you DNS records you need to add:
```
Type: A Record
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Update DNS Records in Wix

#### If Domain is Registered with Wix:

1. **Log into Wix Dashboard**
2. Go to **Settings** → **Domains**
3. Find your domain and click **Manage**
4. Click **Edit DNS Records** or **Advanced DNS**
5. **Delete or disable** old A and CNAME records pointing to Wix
6. **Add new records** from Vercel:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

#### If Domain is with Another Registrar:

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Management** or **DNS Settings**
3. Delete old A and CNAME records
4. Add Vercel's DNS records

### Step 5: Wait for DNS Propagation

- DNS changes take **1-48 hours** to propagate worldwide
- Usually happens within 1-2 hours
- Check status at: [whatsmydns.net](https://whatsmydns.net)

### Step 6: Verify SSL Certificate

- Vercel automatically provisions SSL (HTTPS)
- This happens after DNS is configured
- Usually takes 5-10 minutes after DNS propagates
- Your site will show as secure with the padlock icon

### Step 7: Cancel Wix Hosting (Optional)

**IMPORTANT: Only do this AFTER your domain is working on Vercel!**

You can keep the domain registered with Wix but cancel the hosting plan:
1. Go to Wix Dashboard → **Settings** → **Subscriptions**
2. Cancel your website plan
3. Keep domain registration active (if registered with Wix)

---

## Option 2: Transfer Domain Registration (Advanced)

If you want to fully move away from Wix:

### Step 1: Unlock Domain at Wix

1. Log into Wix
2. Go to **Settings** → **Domains**
3. Click your domain → **Advanced**
4. **Unlock domain** (disable transfer lock)
5. Request **Authorization Code** (EPP code)
6. Check email for the auth code

### Step 2: Choose New Registrar

Popular options:
- **Namecheap** (~$10-15/year) - Recommended, simple
- **Google Domains** (~$12/year) - Easy to use
- **Cloudflare** (~$10/year) - Cheapest, more technical
- **GoDaddy** (~$20/year) - Popular but more expensive

### Step 3: Initiate Transfer at New Registrar

1. Create account at new registrar
2. Start domain transfer process
3. Enter your domain name
4. Enter authorization code from Wix
5. Pay transfer fee (usually includes 1 year renewal)

### Step 4: Approve Transfer

- Check your domain admin email
- Approve the transfer request
- Wait 5-7 days for transfer to complete
- Wix may try to retain you - decline their offers

### Step 5: Configure DNS at New Registrar

Once transfer completes:
1. Go to DNS settings at new registrar
2. Add Vercel's DNS records (see Option 1, Step 3)
3. Wait for DNS propagation

---

## Quick Reference: Vercel DNS Records

When Vercel asks for DNS configuration, use these:

### For Root Domain (make-ready-consulting.com):
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

### For WWW Subdomain (www.make-ready-consulting.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**Note:** Vercel may provide different IP addresses - always use what they show in your dashboard!

---

## Important Tips

### Before Making Changes:

1. ✅ **Deploy to Vercel first** and test the temporary URL
2. ✅ **Lower DNS TTL** to 300 seconds (5 min) 24 hours before switching
3. ✅ **Screenshot current Wix DNS settings** for backup
4. ✅ **Note down your domain registrar** and login details
5. ✅ **Test contact form** on Vercel URL before switching

### During DNS Changes:

1. ✅ Change DNS during **low-traffic hours** (late night/early morning)
2. ✅ Monitor both old and new sites during transition
3. ✅ Don't cancel Wix immediately - wait 48 hours after DNS switch

### After DNS Changes:

1. ✅ Test all pages on your domain
2. ✅ Verify HTTPS/SSL is working
3. ✅ Test contact form on live domain
4. ✅ Check on mobile devices
5. ✅ Update Google Search Console with new property

---

## Troubleshooting

### "Domain already in use" Error in Vercel
- Remove domain from Wix's external domain connections first
- Wait 1 hour and try again

### DNS Not Propagating After 48 Hours
- Verify you deleted OLD records, not just added new ones
- Check nameservers haven't changed
- Contact your domain registrar support

### Site Shows "Not Found" After DNS Change
- Clear browser cache
- Wait longer (try incognito mode)
- Verify Vercel deployment is successful

### SSL Certificate Not Provisioning
- DNS must be fully propagated first
- Can take up to 24 hours after DNS propagates
- Check Vercel dashboard for SSL status

---

## Step-by-Step Checklist for Domain Switch

### Pre-Switch (Do First):
- [ ] Deploy site to Vercel successfully
- [ ] Get temporary Vercel URL (e.g., mrt-website.vercel.app)
- [ ] Test everything on Vercel URL
- [ ] Add domain in Vercel dashboard
- [ ] Get DNS records from Vercel
- [ ] Screenshot current Wix DNS settings
- [ ] Find domain registrar login

### The Switch (Do Carefully):
- [ ] Log into domain registrar/Wix
- [ ] Lower DNS TTL to 300 seconds (wait 24 hours)
- [ ] Delete old A records pointing to Wix
- [ ] Delete old CNAME records
- [ ] Add Vercel A record
- [ ] Add Vercel CNAME record
- [ ] Save DNS changes

### Post-Switch (Verify):
- [ ] Wait 1-2 hours
- [ ] Check DNS propagation at whatsmydns.net
- [ ] Visit your domain (clear cache first)
- [ ] Verify all pages work
- [ ] Test contact form
- [ ] Check HTTPS/SSL certificate
- [ ] Test on mobile
- [ ] Wait 48 hours before canceling Wix

---

## Timeline Estimate

### Option 1 (DNS Pointing):
- **Day 1, Hour 1**: Deploy to Vercel, get temporary URL
- **Day 1, Hour 2**: Add domain in Vercel, update DNS records
- **Day 1, Hour 3-24**: Wait for DNS propagation
- **Day 2**: Domain working on Vercel!
- **Day 3**: Cancel Wix if everything works

### Option 2 (Full Transfer):
- **Day 1**: Unlock domain, get auth code
- **Day 1-2**: Initiate transfer at new registrar
- **Day 5-7**: Transfer completes
- **Day 7-8**: Configure DNS, wait for propagation
- **Day 9**: Domain working on Vercel

---

## Need Help?

Common issues and solutions:

**Q: Will my email break?**
A: Only if you use Wix email. If you have email (like Google Workspace, Microsoft 365), you'll need to preserve MX records when updating DNS.

**Q: Will my site be down?**
A: There might be a brief transition period (minutes to hours) where some users see the old site and some see the new one. Minimize this by lowering TTL beforehand.

**Q: Can I test before switching?**
A: Yes! Use your Vercel temporary URL (e.g., mrt-website.vercel.app) to test everything before touching DNS.

**Q: What if something goes wrong?**
A: You can revert DNS settings to the screenshots you took. Changes typically revert in 1-2 hours.

---

## Next Steps

1. **Deploy to Vercel first** using GIT_SETUP.md
2. **Test thoroughly** on the .vercel.app URL
3. **Come back to this guide** when ready to switch domain
4. **Take it slow** - rushing causes mistakes

Ready to deploy? Start with `npm install` and `npm run dev` to test locally!

