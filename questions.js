const QUEST_BANK = { 
    SimilarPolygons: [], 
    SimilarTriangles: [], 
    ProportionalParts: [], 
    SimilarElements: [] 
};

// دالة مساعدة لتنسيق الأرقام والرموز الرياضية لتظهر من اليسار لليمين داخل التطبيق
function fmt(val) {
    return `<span class="math-ltr">${val}</span>`;
}

// دالة ذكية لضمان جلب 4 خيارات مختلفة تماماً (الإجابة الصحيحة + 3 مشتتات)
function getUniqueOptions(correct, pool) {
    let res = new Set([correct]);
    
    // خلط الخيارات المقترحة
    pool.sort(() => Math.random() - 0.5);
    
    for (let p of pool) {
        let formatted = fmt(p);
        if (res.size < 4 && !Array.from(res).includes(formatted)) {
            res.add(formatted);
        }
    }
    
    // في حال عدم اكتمال 4 خيارات، نضيف أرقام عشوائية كخيارات بديلة لمنع توقف الكود
    let fallback = 1;
    while(res.size < 4) {
        let formatted = fmt(fallback);
        if(!Array.from(res).includes(formatted)){
            res.add(formatted);
        }
        fallback++;
    }
    
    // خلط الخيارات النهائية لتوزيع الإجابة الصحيحة عشوائياً بين الأزرار
    return Array.from(res).sort(() => Math.random() - 0.5);
}

(function generate() {
    // توليد 150 سؤال لكل قسم، الإجمالي = 600 سؤال
    for (let i = 1; i <= 150; i++) {
        
        // ---------------------------------------------------------
        // 1. المضلعات المتشابهة (Similar Polygons)
        // ---------------------------------------------------------
        let a1 = (i % 5) + 2; 
        let b1 = a1 + (i % 4) + 1; // b1 دائماً أكبر من a1
        let p_small = (i % 10 + 5) * a1; 
        let p_large = (p_small / a1) * b1;
        
        let q1_str, ans1, pool1;
        if (i % 2 === 0) {
            q1_str = `مضلعان متشابهان معامل التشابه بينهما ${fmt(`${a1}/${b1}`)}، ومحيط المضلع الأصغر ${fmt(p_small)}. فإن محيط المضلع الأكبر يساوي:`;
            ans1 = p_large;
            pool1 = [p_large + a1, p_large - a1, p_large * 2, p_small * b1, p_large + 2];
        } else {
            q1_str = `مضلعان متشابهان معامل التشابه بينهما ${fmt(`${a1}/${b1}`)}، ومحيط المضلع الأكبر ${fmt(p_large)}. فإن محيط المضلع الأصغر يساوي:`;
            ans1 = p_small;
            pool1 = [p_small + a1, p_small - a1, p_small * 2, Math.floor(p_large / a1), p_small + 2];
        }
        
        QUEST_BANK.SimilarPolygons.push({
            id: `SP_${i}`,
            q: q1_str,
            a: fmt(ans1),
            o: getUniqueOptions(fmt(ans1), pool1)
        });


        // ---------------------------------------------------------
        // 2. المثلثات المتشابهة (Similar Triangles)
        // ---------------------------------------------------------
        let k2 = (i % 4) + 2; 
        let ab = (i % 8) + 3;
        let bc = (i % 7) + 4;
        let de = ab * k2;
        let ef = bc * k2;
        
        let q2_str, ans2, pool2;
        if (i % 2 === 0) {
            q2_str = `المثلثان ABC و DEF متشابهان. إذا كان ${fmt(`AB = ${ab}`)} و ${fmt(`BC = ${bc}`)} و ${fmt(`DE = ${de}`)}، فإن طول الضلع EF يساوي:`;
            ans2 = ef;
            pool2 = [ef + 1, ef - 1, bc * (k2+1), Math.floor(bc / k2) || 1, ef + 2];
        } else {
            q2_str = `المثلثان ABC و DEF متشابهان. إذا كان ${fmt(`BC = ${bc}`)} و ${fmt(`EF = ${ef}`)} و ${fmt(`AB = ${ab}`)}، فإن طول الضلع DE يساوي:`;
            ans2 = de;
            pool2 = [de + 1, de - 1, ab * (k2+1), Math.floor(ab / k2) || 1, de + 2];
        }

        QUEST_BANK.SimilarTriangles.push({
            id: `ST_${i}`,
            q: q2_str,
            a: fmt(ans2),
            o: getUniqueOptions(fmt(ans2), pool2)
        });


        // ---------------------------------------------------------
        // 3. المستقيمات المتوازية والأجزاء المتناسبة (Proportional Parts)
        // ---------------------------------------------------------
        let factor3 = (i % 4) + 2;
        let ae = (i % 6) + 2;
        let ec = (i % 5) + 3;
        let ad = ae * factor3;
        let db = ec * factor3;

        let q3_str, ans3, pool3;
        if (i % 2 === 0) {
            q3_str = `في المثلث ABC، رُسم مستقيم DE يوازي الضلع BC ليقطع AB في النقطة D و AC في النقطة E. إذا كان ${fmt(`AE = ${ae}`)} و ${fmt(`EC = ${ec}`)} و ${fmt(`DB = ${db}`)} فإن طول AD يساوي:`;
            ans3 = ad;
            pool3 = [ad + 1, ad - 1, ad * 2, ae * ec, ad + 2];
        } else {
            q3_str = `في المثلث ABC، رُسم مستقيم DE يوازي الضلع BC ليقطع AB في النقطة D و AC في النقطة E. إذا كان ${fmt(`AD = ${ad}`)} و ${fmt(`AE = ${ae}`)} و ${fmt(`DB = ${db}`)} فإن طول EC يساوي:`;
            ans3 = ec;
            pool3 = [ec + 1, ec - 1, ec * 2, ad * db, ec + 2];
        }

        QUEST_BANK.ProportionalParts.push({
            id: `PP_${i}`,
            q: q3_str,
            a: fmt(ans3),
            o: getUniqueOptions(fmt(ans3), pool3)
        });


        // ---------------------------------------------------------
        // 4. عناصر المثلثات المتشابهة (Similar Elements)
        // ---------------------------------------------------------
        let comm4 = (i % 3) + 2;
        let r1 = (i % 5) + 2;
        let r2 = r1 + (i % 3) + 1;
        let sideA = r1 * comm4;
        let sideB = r2 * comm4;
        let altA = r1 * ((i % 4) + 3);
        let altB = r2 * (altA / r1);

        let elements = ["الارتفاع", "منصف الزاوية", "القطعة المتوسطة"];
        let el_name = elements[i % 3];

        QUEST_BANK.SimilarElements.push({
            id: `SE_${i}`,
            q: `مثلثان متشابهان، طول ضلع في الأول ${fmt(sideA)} وطول الضلع المناظر له في الثاني ${fmt(sideB)}. إذا كان طول ${el_name} في الأول ${fmt(altA)}، فإن طول ${el_name} المناظر له في الثاني يساوي:`,
            a: fmt(altB),
            o: getUniqueOptions(fmt(altB), [altB + 2, altB - 2, altA * 2, altB + r2, altB - r1])
        });
    }
})();

